export function get(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(null);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };
  });
}

export function post(url: string, json: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const postData = JSON.stringify(json);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(postData);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };
  });
}
