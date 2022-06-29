import axios from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap";

const BASE_URL = "http://localhost:3001/";

export default function FileUploader(props) {
    const [drag, setDrag] = useState(false)
    const [fileOption, setFileOption] = useState({
        type: props.type,
        maxSize: props.maxSize * 1000000,
        mimeTypes: props.mimeTypes,
        allowMultiple: props.allowMultiple,
        disabled: props.disabled
    })

    //send file|data to server and update state
    function sendData(e) {
        e.preventDefault()
        Object.entries(props.uploadedFiles).map((x, i) => {
            if (x[1].progress != 100) {
                const formData = new FormData();
                formData.append("docFile", x[1].data);
                axios.post(BASE_URL, formData,
                    {
                        onUploadProgress: data => {
                            props.setuploadedFiles(pre => {
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
                    props.setuploadedFiles(pre => {

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

    //update state when file select
    function selectFile(file) {
        props.setuploadedFiles(prev => {
            let temp = { ...prev }
            Object.values(file).map(x => {
                if (x.size <= fileOption.maxSize && Object.keys(file).includes(x.name)) {
                    temp[x.name] = { progress: 0, link: null, preview: URL.createObjectURL(x), data: x }
                }
            })
            return temp;
        })
    }

    //remove file from state
    function deleteFile(fname) {
        props.setuploadedFiles(pre => {
            let temp = { ...pre };
            delete temp[fname]
            return temp
        })
    }

    //handle drap and drop functionality
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
        <div className="container ">
            <Modal show={props.show}
                onHide={() => props.setModal(!props.show)}
                size="xl" aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Files</Modal.Title>
                </Modal.Header>
                <form onSubmit={(e) => sendData(e)}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-6 d-flex justify-content-center align-items-center">
                                <div className="text-center w-100 h-100 p-4"
                                    style={{ "border": drag ? "3px dashed #000" : "3px dashed #fff" }}
                                    onDragEnter={(e) => handleDragDrop(e, 1)}
                                    onDragOver={(e) => handleDragDrop(e, 2)}
                                    onDragLeave={(e) => handleDragDrop(e, 3)}
                                    onDrop={(e) => handleDragDrop(e, 4)}>
                                    <h4>Drop your file to upload</h4>
                                    <p>or</p>
                                    <label htmlFor="docFile" className="btn btn-primary"
                                        hidden={fileOption.type === "button" ? true : false}>Choose your files</label>
                                    <input onChange={(e) => selectFile(e.target.files)} type="file"
                                        name="docFile"
                                        className="form-control custom-file-input" id="docFile"
                                        multiple={fileOption.allowMultiple}
                                        hidden={fileOption.type === "file" ? true : false}
                                        disabled={fileOption.disabled}
                                        accept={fileOption.mimeTypes.reduce((p, c) => p ? p + "," + c.value : c.value, "")} />
                                    <div id="docFile" className="form-text">{"Max File Size " + fileOption.maxSize / 1000000 + " Mb"}</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <span>Selected File ({Object.keys(props.uploadedFiles).length})</span>
                                {
                                    Object.keys(props.uploadedFiles).length ?
                                        Object.entries(props.uploadedFiles).map((x, i) => {
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
                        <button type="reset" className="btn btn-light"
                            onClick={() => props.setModal(!props.show)}>Cancle</button>
                        <button type="submit" className="btn btn-primary ms-2">Add</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}