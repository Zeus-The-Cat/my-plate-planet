# Dev Tools

## [Husky](https://typicode.github.io/husky/#/)
```
npm install --save-dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```
Add to package.json
```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

- git hook applying [prettier](https://prettier.io/) and Jest Testing
- lint-staged: applies linting to each file

[Flame Graph](https://github.com/spiermar/d3-flame-graph)

## Reference
-[Nextjs Reference](https://blog.logrocket.com/nextjs-cloud-firestore-full-stack-app-tutorial/)

## Attributions

<a href="https://www.vecteezy.com/free-vector/nature">Nature Vectors by Vecteezy</a>

<a href="https://www.vecteezy.com/free-vector/deforestation">Deforestation Vectors by Vecteezy</a>
