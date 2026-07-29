"use client";

import { Form, Input, Button, ConfigProvider } from "antd";
import { useLogin } from "@/hooks/useAuth";
import { LoginPayload } from "@/services/auth";


const PRIMARY = "#FF6813";

export default function LoginForm() {
  const login = useLogin();

    return (
        <div className="flex shadow rounded flex-col mx-auto my-auto xl:justify-center w-full xl:min-h-[calc(100vh-96px)] h-auto px-5 py-8 lg:px-16 lg:py-10 xl:py-16 max-w-xl">
        <h1 className="text-2xl lg:text-3xl text-[#101010] font-semibold text-start mb-1">
          Login to your account
        </h1>
        <p className="text-base text-[#212121]/80 font-medium text-left mb-6">
        
        </p>
        <ConfigProvider theme={{ token: { colorPrimary: PRIMARY } }}>
      <Form
        layout="vertical"
        requiredMark={false}
        autoComplete="on"
        onFinish={(values: LoginPayload) => login.mutate(values)}
      >
        <Form.Item
          name="email"
          label={<span style={{ color: PRIMARY }}>Email</span>}
          rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
        >
          <Input size="large" placeholder="you@sohcahtoa.test" autoComplete="username" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ color: PRIMARY }}>Password</span>}
          rules={[{ required: true, message: "Enter your password" }]}
        >
          <Input.Password size="large" placeholder="********" autoComplete="current-password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={login.isPending}
        >
          Sign in
        </Button>
      </Form>
    </ConfigProvider>
      </div>
    
  );
}

