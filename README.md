Note: react-draggable and react-resizable types

We attempted to install the DefinitelyTyped package for `react-draggable` with:

    npm install -D @types/react-draggable

npm returned a 404 for `@types/react-draggable` because `react-draggable` already ships its own TypeScript definitions (check `node_modules/react-draggable/typings/index.d.ts`). No additional `@types` package is required.

`react-resizable` does not ship types. To avoid TypeScript errors we added a minimal ambient declaration file at `client/src/types/react-resizable.d.ts`. If upstream adds types or a `@types/react-resizable` package becomes available you can delete that file and install/upgrade the official types.

If you see type errors relating to these packages, run:

    npm install
    npm run build

and ensure your editor/TS server is restarted so the new declaration file is picked up.