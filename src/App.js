import FileUploader from "./FileUpload";

function App() {

  return (
    <FileUploader
      type="file"
      mimeTypes={[
        { value: 'image/png', label: 'PNG' },
        { value: 'image/jpg', label: 'JPG' },
        { value: 'image/jpeg', label: 'JPEG' },
        { value: 'image/gif', label: 'GIF' },
        { value: 'image/svg+xml', label: 'SVG' },
      ]}
      allowMultiple={false}
      maxSize={5}
      disabled={false}
      className={""}
      name={""}
    />
  )

}

export default App;
