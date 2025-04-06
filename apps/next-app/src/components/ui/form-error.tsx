import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface FormErrorProps {
  message?: string;
  code?: string;
}

export function FormError({ message, code }: FormErrorProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription>{message} - {code}</AlertDescription>
    </Alert>
  );
} 