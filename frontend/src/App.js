function App() {
  const get = async () => {
    const res = await fetch("http://localhost:8008");
    console.log(res);
  };
  get();
  return <div></div>;
}

export default App;
