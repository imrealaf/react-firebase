# React Firebase

### The fastest and most efficient way to use Firebase in a React application

- Fetch, add, and mutate Firestore data with **zero boilerplate** using provided `useDoc` and `useCollection` hooks

- These **Firestore hooks** are built on top of [SWR](https://swr.vercel.app/), meaning you get all of its awesome benefits out-of-the-box

- Easily integrate **Firebase Authentication** into your app with **zero boilerplate** using the provided auth/render functions and `useAuth` hook

- Authentication state is automatically handled and maintained for you using [RxJS](https://rxjs.dev/) under the hood

## Getting Started

Simply install the package along with it's peer dependencies

```sh
yarn add fm-react-firebase firebase swr
```

or

```sh
npm install fm-react-firebase firebase swr
```

## Firestore Documents

Fetching a document is too easy with the `useDoc` hook

```js
const { data } = useDoc("posts/some-doc-id");
```

You can also use the same hook to update the document

```jsx
const { set } = useDoc("posts/some-doc-id");

const updateDoc = async () => {
    await set(dataToUpdate)
    alert('Document was updated!')
}

return (
    <button onClick={updateDoc}>Submit</submit>
)
```
