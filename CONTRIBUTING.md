# Contributing to WaveForge

Thank you for your interest in contributing to WaveForge! We welcome community contributions, bug reports, feature suggestions, and pull requests.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to ensure a welcoming and inclusive environment for everyone.

## Licensing Notice

Please note that WaveForge is subject to an **All Rights Reserved** license (see [LICENSE](LICENSE)). By submitting a pull request or contribution, you grant the project maintainers permission to incorporate your contributions into the WaveForge codebase.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to see if the problem has already been reported. If not, open a new issue on our [GitHub Issues](https://github.com/PROGAMERYT-op/WaveForge/issues) page using the **Bug Report** template and include:

* A clear and descriptive title
* Steps to reproduce the problem
* Expected vs actual behavior
* Your browser, OS, and device specifications
* Any relevant console logs or screenshots

### Requesting Features

Feature requests and suggestions are welcome! Open an issue on our [GitHub Issues](https://github.com/PROGAMERYT-op/WaveForge/issues) page using the **Feature Request** template and explain:

* The motivation behind the suggested feature
* How you envision it working
* Potential visual or UI/UX mockups, if applicable

### Local Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/WaveForge.git
   cd WaveForge
   ```

2. **Serve Locally**
   WaveForge runs entirely in the browser without build tools or external server dependencies. You can run any static web server:
   ```bash
   python3 -m http.server 8080
   ```
   Open `http://localhost:8080` in your web browser.

3. **Project Architecture**
   * `index.html` - Landing page
   * `visualizer.html` - Main application shell
   * `Visualizers/` - Individual visualizer mode modules
   * `assets/js/app.js` - Main audio engine, export engine, and UI controller

### Submitting Pull Requests

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Make your changes adhering to existing code formatting and structure.
3. Test your changes locally across different browsers if possible.
4. Push your branch to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
5. Open a Pull Request on GitHub targeting the `main` branch. Complete the [Pull Request Template](.github/pull_request_template.md).

## Questions or Support

If you have questions or need assistance, please open a thread or issue on our [GitHub Issues](https://github.com/PROGAMERYT-op/WaveForge/issues) page.
