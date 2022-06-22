import axios from "axios"
import { useState } from "react";

function App() {

  const [pro, setpro] = useState({})
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)

  function sendData(e) {

    e.preventDefault()
    files.map((x, i) => {
      const formData = new FormData();
      formData.append("docFile", x);
      console.log(x)

      axios.post("http://localhost:3001/", formData,
        {
          onUploadProgress: data => {
            setpro(pre => {
              return {
                ...pre,
                [x.name]: {
                  ...pre[x.name],
                  progress: Math.round((100 * data.loaded) / data.total)
                }
              }
            })
            // console.log(x.name + ":" + Math.round((100 * data.loaded) / data.total))
          }
        }
      ).then((res) => {
        console.log(res)
        setpro(pre => {
          return {
            ...pre,
            [x.name]: {
              ...pre[x.name],
              link: res.data.data[0]
            }
          }
        })
      })

    })

  }

  function selectFile(file) {
    setFiles(files.concat(Object.values(file)))
    let temp = pro
    Object.values(file).map(x => {
      temp[x.name] = { progress: 0, link: null, preview: URL.createObjectURL(x) }
    })
    setpro(temp)
  }

  function deleteFile() {

  }

  function handleDragIn(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDrag(true)
    }
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDrag(true)
    }
  }

  function handleDragOut(e) {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
  }

  function handleDrop(e) {
    console.log(e)
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // console.log(e.dataTransfer.files)
      selectFile(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }

  return (
    <div className="container fileUploaderSec">

      <div className="modal show" tabIndex="-1" id="fileuploadModal">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Files</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={(e) => sendData(e)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="text-center w-100 h-100 p-4"
                      style={{ "border": drag ? "3px dashed #000" : null }}
                      onDragEnter={(e) => handleDragIn(e)}
                      onDragLeave={(e) => handleDragOut(e)}
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDrag(e)}>
                      <h4>Drop your file to upload</h4>
                      <p>or</p>
                      <label htmlFor="docFile" className="btn btn-primary">Choose your files</label>
                      <input onChange={(e) => selectFile(e.target.files)} hidden
                        className="form-control custom-file-input" type="file" name="docFile" id="docFile" multiple />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <span>Selected File ({Object.keys(pro).length})</span>
                    {
                      Object.keys(pro).length ?
                        Object.entries(pro).map((x, i) => {
                          return (
                            <div className="card mb-3" key={"fileCard_" + i}>
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <img src={x[1].preview} alt="preview_img" className="img-fluid h-100" />
                                </div>
                                <div className="col-md-8">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                      <a href={x[1].link ? "http://localhost:3001/" + x[1].link : "#"} target="_blank" rel="noreferrer" className="card-text filecardTitle">
                                        {x[0]}
                                      </a>
                                      <button className="btn btn-sm py-0 px-1 ms-1"
                                        onClick={() => deleteFile()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="progress" style={{ "height": "2px" }}>
                                      <div className="progress-bar" role="progressbar" style={{ "width": x[1].progress + "%" }} aria-valuenow={x[1].progress} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <p className="card-text"><small className="text-muted">{x[1].progress + "% Done"}</small></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        : null
                    }
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="reset" className="btn btn-light">Cancle</button>
                <button type="submit" className="btn btn-primary ms-2">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )

}

export default App;
