import { useState } from "react";
import FileUploader from "./FileUpload";

const BASE_URL = "http://localhost:3001/"
function App() {

  const [modalShow, setModalShow] = useState(false)
  const [uploadedFiles, setuploadedFiles] = useState({})

  return (
    <>
      <div className="container">
        <button className="btn btn-primary" data-toggle="modal" data-target="#exampleModal"
          onClick={() => setModalShow(!modalShow)}>Add File</button>
        <div className="list-group">
          {
            Object.values(uploadedFiles).map((x, i) => {
              if (x.progress === 100 && x.link) {
                return (
                  <a key={"file_uploaded_" + i} href={BASE_URL + x.link} className="list-group-item list-group-item-action" aria-current="true"
                    target="_blank" rel="noreferrer">
                    {x.data.name}
                  </a>
                )
              }
            })
          }
        </div>
      </div>

      <FileUploader
        show={modalShow}
        setModal={setModalShow}
        type="file"
        mimeTypes={[
          { value: 'image/png', label: 'PNG' },
          { value: 'image/jpg', label: 'JPG' },
          { value: 'image/jpeg', label: 'JPEG' },
          { value: 'image/gif', label: 'GIF' },
          { value: 'image/svg+xml', label: 'SVG' },
        ]}
        allowMultiple={true}
        maxSize={5}
        disabled={false}
        className={""}
        name={""}
        setuploadedFiles={setuploadedFiles}
        uploadedFiles={uploadedFiles}
      />
    </>

  )

}

export default App;
