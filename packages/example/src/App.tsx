import { empty, MobxZodField } from "@monoid-dev/mobx-zod-form";
import {
  FormContextProvider,
  useForm,
  useFormContext,
} from "@monoid-dev/mobx-zod-form-react";
import { observer } from "mobx-react";
import { z, ZodNumber, ZodString } from "zod";

import "./App.css";

const TextInput = observer(
  ({ field }: { field: MobxZodField<ZodString | ZodNumber> }) => {
    return (
      <div>
        <input
          value={field.rawInput as string}
          onChange={(e) => field.setRawInput(e.target.value)}
        />
        {field.errorMessages.map((e, i) => (
          <div style={{ color: "red" }} key={i}>
            {e}
          </div>
        ))}
      </div>
    );
  },
);

const Form1 = () => {
  const form = useForm(
    z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    }),
    { validateOnMount: false },
  );

  return (
    <div style={{ border: `1px solid black` }}>
      <TextInput field={form.root.fields.username} />
      <TextInput field={form.root.fields.password} />
    </div>
  );
};

const Form2 = () => {
  const form = useForm(
    z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    }),
    {
      validateOnMount: true,
    },
  );

  return (
    <div style={{ border: `1px solid black` }}>
      <TextInput field={form.root.fields.username} />
      <TextInput field={form.root.fields.password} />
    </div>
  );
};

const FormArray1 = observer(() => {
  const form = useForm(
    z.object({
      users: z.array(
        z.object({
          name: z.string().min(1),
          age: z.number().min(5),
        }),
      ),
    }),
  );

  return (
    <div style={{ border: `1px solid black` }}>
      {form.root.fields.users.elements.map((userField) => (
        <div key={userField.uniqueId}>
          <div style={{ border: `1px solid black` }}>
            <TextInput field={userField.fields.name} />
            <TextInput field={userField.fields.age} />
          </div>
        </div>
      ))}

      <button
        onClick={() =>
          form.root.fields.users.push({
            name: "",
            age: empty,
          })
        }
      />
    </div>
  );
});

const FormContext1Type = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  inner: z.string().min(1),
});

const FormContext1Children = observer(() => {
  const form = useFormContext(FormContext1Type);

  return <TextInput field={form.root.fields.inner} />;
});

const FormContext1 = observer(() => {
  const form = useForm(
    z.object({
      username: z.string().min(1),
      password: z.string().min(6),
      inner: z.string().min(1),
    }),
    { validateOnMount: false },
  );

  return (
    <FormContextProvider form={form}>
      <div style={{ border: `1px solid black` }}>
        <TextInput field={form.root.fields.username} />
        <TextInput field={form.root.fields.password} />
        <FormContext1Children />
      </div>
    </FormContextProvider>
  );
});

function App() {
  return (
    <div className="App">
      <Form1 />
      <Form2 />
      <FormArray1 />
      <FormContext1 />
    </div>
  );
}

export default App;
