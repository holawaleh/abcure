export function getErrorMessage(error) {
  if (!error.response) {
    return "Could not reach the server. Check your connection and try again.";
  }

  const { status, data } = error.response;

  if (status === 401) {
    return "Incorrect username or password.";
  }
  if (status === 403) {
    return "You do not have permission to do that.";
  }
  if (status === 404) {
    return "That item could not be found.";
  }
  if (status === 500) {
    return "Something went wrong on our end. Please try again shortly.";
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data && typeof data === "object") {
    const lines = Object.entries(data).map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : messages;
      return field === "non_field_errors" ? text : `${field}: ${text}`;
    });
    if (lines.length > 0) return lines.join(" ");
  }

  return "Something went wrong. Please try again.";
}
