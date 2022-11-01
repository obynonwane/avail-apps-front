<div align="Center">
<h1>avail-apps</h1>
<h3>Block Explorer & Apps for the Polygon Avail blockchain</h3>
</div>

<br>

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/apps)

# Introduction

`avail-apps` is a modified version of the [@polkadot/apps](https://github.com/polkadot-js/apps) repository for visualizing and interacting with the Avail network.

Learn more about Avail at the Avail [product page](https://polygon.technology/solutions/polygon-avail/) and [documentation](https://wiki.polygon.technology/docs/avail/introduction/what-is-avail/) websites.

You can access a live version of the explorer for the Avail Testnet at https://testnet.polygonavail.net/

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [apps-electron](packages/apps-electron/) Desktop app running [apps](packages/apps/).
- [page-accounts](packages/page-accounts/) A basic account management app.
- [page-address-book](packages/page-address-book/) A basic address management app.
- [page-democracy](packages/page-democracy/) A basic voting app, allowing votes on activate proposals and referenda.
- [page-explorer](packages/page-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-js](packages/page-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [page-settings](packages/page-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage](packages/page-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [page-toolbox](packages/page-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [page-transfer](packages/page-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## Development

Contributions are welcome!

To start off, this repo uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/maticnetwork/avail-apps.git <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ensure that env file is created as mentioned in `env-example` file 
6. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
7. Access the UI via [http://localhost:3000](http://localhost:3000)
