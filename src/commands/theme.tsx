import { Octokit } from 'octokit'
import chalk from 'chalk'
import ora from 'ora'
import jetpack from 'fs-jetpack'
import yargs, { ArgumentsCamelCase } from 'yargs'
import { join, sep } from 'path'
import fs from 'fs'
import { getTRPC } from '../lib/trpc'
import { getManifest } from '../lib/getManifest'
import { iconToString } from '../lib/iconToString'
import { assetsToStringMap } from '../lib/assetsToStringMap'
import { isIconify, readConfig } from '../lib/utils'
import { getReadme } from '../lib/getReadme'
import { escAction } from '../constants'

type Args = {
  action: 'init' | 'install' | 'publish'
  themeName?: string
}

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

class Command {
  readonly command = 'theme <action> [themeName]'
  readonly describe = 'PenX theme'

  private app: Octokit

  private params = {
    owner: 'penx-labs',
    repo: 'themes',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }

  private baseBranchSha: string

  private trpc: any

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    const config = readConfig()

    if (!['init', 'install', 'publish'].includes(args.action)) {
      console.log(chalk.yellow('Invalid action. Use "init", "install", or "publish" instead.'))
      console.log(
        chalk.yellow('eg: penx theme init, penx theme install minimal, or penx theme publish'),
      )
      return
    }

    if (args.action === 'publish') {
      if (!config.user || !config.token) {
        console.log(
          chalk.yellow('Please login first, try to login by command:'),
          chalk.green('npx penx login'),
        )
        return
      }
      await this.publish()
      return
    }

    if (args.action === 'install') {
      if (!args.themeName) {
        return console.log(
          chalk.red(
            'Theme name is required when installing a theme. eg: penx theme install minimal',
          ),
        )
      }
      await this.install(args.themeName)
      return
    }
  }

  async publish() {
    this.trpc = await getTRPC()
    // console.log('Build success~')
    console.log(`Publishing theme...`)
    const spinner = ora('Upload the theme files...').start()
    try {
      const manifest = await getManifest()
      if (!manifest?.name) {
        spinner.fail(`Theme name is required in your manifest.json`)
        return
      }

      const canPublish = await this.trpc.theme.canPublishTheme.query({
        name: manifest.name,
      })

      if (!canPublish) {
        spinner.fail()
        return
      }

      await this.pushToGithub()

      const readme = getReadme()

      const screenshotsDir = join(process.cwd(), 'screenshots')
      const screenshotsPaths = jetpack.list(screenshotsDir) || []

      await this.trpc.theme.upsertTheme.mutate({
        name: manifest.name,
        manifest: JSON.stringify({
          ...manifest,
          screenshots: screenshotsPaths,
        }),
        readme,
        logo: isIconify(manifest.icon)
          ? JSON.stringify(manifest.icon)
          : await iconToString(manifest.icon),
      })

      spinner.succeed('Publish success!')
    } catch (error) {
      spinner.fail('Publish failed, please try again!')
      console.log(error)
    }
  }

  getDownloadURL(themeName: string, filePath: string) {
    return `https://raw.githubusercontent.com/${this.params.owner}/${this.params.repo}/main/themes/${themeName}/${filePath}`
  }

  async install(themeName = '') {
    const spinner = ora(`Install "${themeName}" theme ...`).start()
    try {
      const res = await fetch(this.getDownloadURL(themeName, 'files.json'))

      if (res.status == 404) {
        spinner.fail(`No theme "${themeName}" found.`)
        return
      }

      const files = (await res.json()) as string[]

      let promises: Promise<any>[] = []
      for (const file of files) {
        promises.push(fetch(this.getDownloadURL(themeName, file)).then((r) => r.text()))
      }

      const results = await Promise.all(promises)

      files.forEach((file, index) => {
        const pathname = join(process.cwd(), 'src', 'themes', themeName, file)

        const text = results[index]
        jetpack.write(pathname, text)
      })

      spinner.succeed(`Install "${themeName}" theme success!`)
    } catch (error: any) {
      spinner.fail(error?.toString())
    }
  }

  async init() {
    // TODO:
  }

  getInstallDir() {
    //
  }

  getReadmeContent(extensionName: string) {
    try {
      let readmePath = join(process.cwd(), 'README.md')
      if (!jetpack.exists(readmePath)) {
        readmePath = join(process.cwd(), 'readme.md')
      }

      return jetpack.read(readmePath, 'utf8')
    } catch (error) {
      return `## ${extensionName}`
    }
  }

  async createTree() {
    let treeItems: TreeItem[] = []
    const manifest = await getManifest()

    const list = jetpack
      .find(process.cwd(), {
        matching: ['**/*'],
      })
      .filter((file) => !file.startsWith('.'))

    for (const item of list) {
      const pathname = item.split(sep).join('/')
      if (item.startsWith('assets') || item.startsWith('screenshots')) {
        const content = fs.readFileSync(item, { encoding: 'base64' })
        const { data } = await this.app.request('POST /repos/{owner}/{repo}/git/blobs', {
          ...this.params,
          content,
          encoding: 'base64',
        })

        treeItems.push({
          path: `themes/${manifest.name}/${pathname}`,
          mode: '100644',
          type: 'blob',
          sha: data.sha,
        })
      } else {
        treeItems.push({
          path: `themes/${manifest.name}/${pathname}`,
          mode: '100644',
          type: 'blob',
          content: jetpack.read(item, 'utf8'),
        })
      }
    }

    treeItems.push({
      path: `themes/${manifest.name}/files.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(list, null, 2),
    })

    return treeItems
  }

  async getBaseCommit() {
    const ref = await this.app.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
      ...this.params,
      ref: `heads/main`,
    })

    this.baseBranchSha = ref.data.object.sha
    return this.baseBranchSha
  }

  private async commit(treeSha: string) {
    const parentSha = this.baseBranchSha
    const manifest = await getManifest()
    const msg = `Release theme: ${manifest.name}`

    const commit = await this.app.request('POST /repos/{owner}/{repo}/git/commits', {
      ...this.params,
      message: `${msg}`,
      parents: [parentSha],
      tree: treeSha,
    })
    return commit
  }

  private async updateRef(commitSha: string = '') {
    await this.app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      ...this.params,
      ref: 'heads/main',
      sha: commitSha,
      force: true,
    })
  }

  private pushToGithub = async () => {
    try {
      const token = await this.trpc.theme.getGitHubToken.query()
      this.app = new Octokit({ auth: token })

      const baseCommit = await this.getBaseCommit()

      // update tree to GitHub before commit
      const { data } = await this.app.request('POST /repos/{owner}/{repo}/git/trees', {
        ...this.params,
        tree: await this.createTree(),
        base_tree: baseCommit,
      })

      // create a commit for the tree
      const { data: commitData } = await this.commit(data.sha)

      // update ref to GitHub server after commit
      await this.updateRef(commitData.sha)
    } catch (error) {
      console.log('error', error)
    }
  }
}

const command = new Command()

export default command
