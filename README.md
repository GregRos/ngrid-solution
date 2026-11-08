# Solution

## Optimization problem
The optimization solution of finding the right contract is covered in:

- [optimization prompt](./docs/optimization/prompt.md)
- [optimization solution](./docs/optimization/solution.md)

It's implemented in the code [here](./src/compute/index.ts)

## Presentation
The solution is presented as an interactive app that visualizes how different contracts affect energy costs.

The app is written in TypeScript and is client-only. It fetches the CSV as though from a server.

The description of the app is found in:

- [creation prompt](./docs/app/frontend.prompt.md)
- [refactoring prompt](./docs/app/organization.prompt.md)

There were also some prompts that weren't captured here. Mainly cussing.

To launch, run:

```sh
npm install
npm start
```

Open the address printed by the development server. 

