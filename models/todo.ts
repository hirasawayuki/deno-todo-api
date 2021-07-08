interface Todo {
  id: string;
  done: boolean;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const FILE_PATH = './db/todos.json';

export const getAll = async(): Promise<Todo[]>  => {
  const data = await Deno.readFile(FILE_PATH);
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(data));
}
