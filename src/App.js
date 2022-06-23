import axios from "axios"
import { useState } from "react";

function App() {

  const [file, setFile] = useState({})
  const [drag, setDrag] = useState(false)

  function sendData(e) {
    e.preventDefault()
    Object.entries(file).map((x, i) => {
      if (x[1].progress != 100) {
        const formData = new FormData();
        formData.append("docFile", x[1].data);
        //console.log(x[0])
        axios.post("http://localhost:3001/", formData,
          {
            onUploadProgress: data => {
              setFile(pre => {
                return {
                  ...pre,
                  [x[0]]: {
                    ...pre[x[0]],
                    progress: Math.round((100 * data.loaded) / data.total)
                  }
                }
              })
            }
          }
        ).then((res) => {
          //console.log(res)
          setFile(pre => {
            return {
              ...pre,
              [x[0]]: {
                ...pre[x[0]],
                link: res.data.data[0]
              }
            }
          })
        })
      }
    })
  }

  function selectFile(file) {
    setFile(prev => {
      let temp = { ...prev }
      Object.values(file).map(x => {
        temp[x.name] = { progress: 0, link: null, preview: URL.createObjectURL(x), data: x }
      })
      return temp;
    })
  }

  function deleteFile(fname) {
    setFile(pre => {
      let temp = { ...pre };
      delete temp[fname]
      return temp
    })
  }

  function handleDragDrop(e, i) {
    e.preventDefault()
    e.stopPropagation()
    switch (i) {
      // handle DragIn
      case 1:
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          setDrag(true)
        }
        break;
      // handle Drag
      case 2:
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          setDrag(true)
        }
        break;
      // handle DragOut
      case 3:
        setDrag(false)
        break;
      // handle Drop
      case 4:
        setDrag(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          selectFile(e.dataTransfer.files)
          e.dataTransfer.clearData()
        }
        break;
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
                      onDragEnter={(e) => handleDragDrop(e, 1)}
                      onDragOver={(e) => handleDragDrop(e, 2)}
                      onDragLeave={(e) => handleDragDrop(e, 3)}
                      onDrop={(e) => handleDragDrop(e, 4)}>
                      <h4>Drop your file to upload</h4>
                      <p>or</p>
                      <label htmlFor="docFile" className="btn btn-primary">Choose your files</label>
                      <input onChange={(e) => selectFile(e.target.files)} hidden
                        className="form-control custom-file-input" type="file" name="docFile" id="docFile" multiple />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <span>Selected File ({Object.keys(file).length})</span>
                    {
                      Object.keys(file).length ?
                        Object.entries(file).map((x, i) => {
                          return (
                            <div className="card mb-3" key={"fileCard_" + i}>
                              <div className="row g-0">
                                <div className="col-md-4">
                                  <img src={x[1].preview} alt="preview_img" className="img-fluid h-100" />
                                </div>
                                <div className="col-md-8">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                      <a href={x[1].link && "http://localhost:3001/" + x[1].link} target="_blank" rel="noreferrer" className="card-text filecardTitle">
                                        {x[0]}
                                      </a>
                                      <button type="button" className="btn btn-sm py-0 px-1 ms-1"
                                        onClick={() => deleteFile(x[0])}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
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
