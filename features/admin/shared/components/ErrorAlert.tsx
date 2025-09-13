export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-100 p-4 text-center text-red-700" role="alert">
      {message}
    </div>
  );
}
