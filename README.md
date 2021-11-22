# tailwind-react-datepicker

A simple React component that counts from 0 - 100 and then resets back to 0. This runs for infinity and yes, this is not meant to be functional in any way.

## How to use

Clone this repo to your local computer, then run:

- `npm install && npm run build`

- To make this component available to other projects on your local computer, run `yarn link`.
- Then go to the project where you want to use this package and run `yarn link "tailwind-react-datepicker"`.

Finally, to fix the multiple copies of React bug that shows up with linked React packages:

- navigate to the root of the `tailwind-react-datepicker` package
- run `npm link "../path/to/your/project"`

You can now import `tailwind-react-datepicker` as a normal package installed from npm like so:

```
import DatePicker from 'tailwind-react-datepicker'
...
```

You can also import the type definitions if you're using TypeScript like so:

```
import DatePicker from 'tailwind-react-datepicker'
...
```
