import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  let title = "Unexpected error";
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    title = `Route Error (${error.status})`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
