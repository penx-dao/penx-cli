# **PenX CLI**

## **Introduction**

The `penx-cli` is a command-line tool designed to streamline the development and management of themes for the [PenX project](https://github.com/penx-labs/penx). This documentation provides an overview of its commands, usage examples, and best practices for working with the tool.

## **Installation**

To install the `penx-cli`, use the following command:

```bash
npm install -g penx-cli
```

This will globally install the CLI tool on your system, making it accessible from any directory.

## **Authentication Commands**

### **Login**
Log in to your PenX account to authenticate and gain access to additional features.

```bash
penx login
```

### **Logout**
Log out of your PenX account.

```bash
penx logout
```

### **Check Login Status**

Verify which account is currently logged in.

```bash
penx whoami
```

## **Theme Management Commands**

### Clone penx

Before develop a theme for PenX, you should clone penx to your computer.

Follow this docs to develop PenX locally: [local-development](https://github.com/penx-labs/penx?tab=readme-ov-file#local-development)

```bash
git clone https://github.com/penx-labs/penx
```

### **Initialize a New Theme**
Set up a new theme in your PenX project. This command creates the necessary structure and configuration files for a new theme.

```bash
penx theme init
```

### **Install a Theme**
Install an existing theme into your PenX project. Replace `<theme-name>` with the name of the desired theme.

```bash
penx theme install <theme-name>
```

Example:

```bash
penx theme install my-awesome-theme
```

### **Publish a Theme**
Publish your custom theme to the PenX theme marketplace, making it available for others to use.

```bash
penx theme publish
```

## **Help and Support**

To view help information for any command, use the `--help` flag. For example:

```bash
penx --help
```

Or for a specific command:

```bash
penx theme --help
```

This will display detailed information about available subcommands and options.


## **Best Practices**

- Always run `penx-cli` commands from within your PenX project directory.
- Use meaningful names when initializing or publishing themes.
- Regularly update `penx-cli` to access new features and bug fixes:
  ```bash
  npm update -g penx-cli
  ```
- Provide descriptive metadata when publishing themes to improve discoverability in the marketplace.


## **Feedback and Contributions**

If you encounter issues or have suggestions for improvement, please visit the [PenX GitHub repository](https://github.com/penx-labs/penx) to open an issue or contribute directly.

Happy theming! 🎨
