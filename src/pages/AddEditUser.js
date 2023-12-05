import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { storage, db } from '../firebase';
import { useParams, useNavigate, } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const initialState = {
    name: " ",
    email: "",
    info: " ",
    contact: "",
}
const AddEditUser = () => {

    const [data, setData] = useState(initialState);
    const { name, email, contact, info } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        id && getSingleUser(id , setData );
    }, [id , setData ])
    const getSingleUser = async () => {
        const docRef = doc(db, "users", id)
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setData({ ...snapshot.data() });
        }
    };
    useEffect(() => {
        const uploadFile = () => {
           // const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is Pause");
                            break;
                        case "running":
                            console.log("Upload is running")
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({ ...prev, img: downloadURL }));
                    })
                }
            );
        };
        file && uploadFile();
    }, [file]);
    const handleChange = (e) => {
        console.log("the function in e target handlechange", data);

        setData({...data, [e.target.name]: e.target.value }
        );
        console.log("the e target handlechange", name
        )
    };

    const validate = () => {
        let errors = {};
        if (!name) {
            errors.name = "Name is Required"
        }
        else if (!email) {
            errors.email = "Email is Required"
        }
        else if (!info) {
            errors.info = " Info is Required"
        }
        else if (!contact) {
            errors.contact = "Contact is Required"
        }
        return errors
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length)
            return setErrors(errors);
        setIsSubmit(true);
        if (!id) {
            try {
                await addDoc(collection(db, "users"), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log("add user ".error)
            }

        } else {
            try {
                await updateDoc(doc(db, "users", id), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log("add user", error)
            }

        }

        navigate('/');
    }

    return (
        <div>
            <Grid centered verticalAlign='middle' columns="3" style={{ height: "80vh" }}  >
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <div>
                            {isSubmit ? (
                                <Loader active inline="centered" size='huge' />
                            ) : (
                                <>
                                    <h2>{id ? "Update User" : "Add Usser"}  </h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            label="name"
                                            errors={errors.name ? { content: errors.name } : null}
                                            placeholder="Enter Name"
                                            type='text'
                                            name="name"
                                            onChange={handleChange}
                                            value={name}
                                            autoFocus
                                        />
                                        <Form.Input
                                            label="email"
                                            error={errors.email ? { content: errors.email } : null}
                                            placeholder="Enter Email"
                                            type="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={email}
                                            autoFocus
                                        />
                                        <Form.TextArea
                                            label="Info"
                                            error={errors.info ? { content: errors.info } : null}
                                            placeholder="Enter Info"
                                            name="info"
                                            type='textarea'
                                            onChange={handleChange}
                                            value={info}
                                            autoFocus
                                        />
                                        <Form.Input
                                            label="Contact"
                                            error={errors.contact ? { content: errors.contact } : null}
                                            placeholder="Enter Contact"
                                            name="contact"
                                            type='number'
                                            onChange={handleChange}
                                            value={contact}
                                            autoFocus
                                        />
                                        <Form.Input
                                            label="Upload"
                                            type="file"
                                            placeholder="Enter Upload"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            autoFocus
                                        />
                                        <Button primary
                                            type='submit'
                                            disabled={progress !== null && progress < 100}
                                        >
                                            Submit
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default AddEditUser;