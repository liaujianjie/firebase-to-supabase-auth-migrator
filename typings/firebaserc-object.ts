type FirebasercObject = {
  projects: {
    default: string;
    [label: string]: string;
  };
};

export function isFirebasercObject(obj: any): obj is FirebasercObject {
  if (typeof obj !== "object") {
    return false;
  }
  if (!("default" in obj)) {
    return false;
  }

  for (const projectId in Object.values(obj)) {
    if (typeof projectId !== "string") {
      return false;
    }
  }

  return true;
}
