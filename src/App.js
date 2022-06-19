import { Container, Row, Col, Button, Modal, Card, ProgressBar } from "react-bootstrap";
import axios from "axios"
import { useEffect, useState } from "react";

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

  function selectFile(e) {
    console.log(e.target.files)
    setFiles(Object.values(e.target.files))
    let temp = {}
    Object.values(e.target.files).map(x => {
      temp[x.name] = { progress: 0, link: null, preview: URL.createObjectURL(x) }
    })
    setpro(temp)
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
      let temp = files;
      temp.push(Object.values(e.dataTransfer.files))
      setFiles(temp)
      console.log(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }

  return (
    <Container className="fileUploaderSec">
      <Modal show={true} dialogClassName="modal-90w" centered={true} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <form onSubmit={(e) => sendData(e)}>
          <Modal.Body>
            <Row>
              <Col md={2}></Col>
              <Col md={6} className="d-flex justify-content-center align-items-center">
                <div className="text-center w-100 h-100 p-4"
                  style={{ "border": drag ? "3px dashed #000" : null }}
                  onDragEnter={(e) => handleDragIn(e)}
                  onDragLeave={(e) => handleDragOut(e)}
                  onDrop={(e) => handleDrop(e)}
                  onDragOver={(e) => handleDrag(e)}>
                  <h4>Drop your file to upload</h4>
                  <p>or</p>
                  <label htmlFor="docFile" className="btn btn-primary">Choose your files</label>
                  <input onChange={(e) => selectFile(e)} hidden
                    className="form-control custom-file-input" type="file" name="docFile" id="docFile" multiple />
                </div>
              </Col>
              <Col md={4}>
                <span>Selected File ({Object.keys(pro).length})</span>
                {
                  Object.keys(pro).length ?
                    Object.entries(pro).map((x, i) => {
                      return (
                        <div className="card mb-3" key={"fileCard_" + i}>
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img src={x[1].preview} className="img-fluid h-100" />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <a href={x[1].link ? "http://localhost:3001/" + x[1].link : "#"} target="_blank" className="card-text filecardTitle">
                                  {x[0]}
                                </a>
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

              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button type="reset" variant="light">Cancle</Button>
            <Button type="submit" variant="primary" className="ms-2">Done</Button>
          </Modal.Footer>
        </form>
      </Modal>

    </Container>
  )

}

export default App;
