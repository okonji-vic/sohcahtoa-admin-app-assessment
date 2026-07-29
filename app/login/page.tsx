import { Suspense } from "react";
import SignInLayout from "@/layouts/auth/LoginLayout";
import SohCahToaPageLoader from "@/components/loader/PageLoader";


const SignInModule = () => {
  return (
    <Suspense fallback={<SohCahToaPageLoader />}>
        <SignInLayout />
    </Suspense>
  );
};

export default SignInModule;
