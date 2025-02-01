import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const VerifyingResetLink = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verifying Reset Link
          </CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your reset link...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default VerifyingResetLink;
