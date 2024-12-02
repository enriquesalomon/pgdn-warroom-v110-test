import { useState } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import Input from "../../../ui/Input";
import FormRowVertical from "../../../ui/FormRowVertical";
import { useLogin } from "../hooks/useLogin";
import SpinnerMini from "../../../ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    // if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isPending}>
          {!isPending ? "Log in" : <SpinnerMini />}
        </Button>
        {/* <div className="text-center mt-4 underline underline-offset-8 text-sm">
          Ctrl+Q to Close Application
        </div> */}
        <div className="text-sm text-gray-500 font-base text-center mt-4">
          Ctrl+Q to Close Application
        </div>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;