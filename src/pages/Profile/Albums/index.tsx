import { useEffect, useRef, useState } from "react";
import { addPost, getAllPosts, handleDeletePhoto } from "../../../helpers/api";
import { IPost } from "../../../helpers/types";
import { BASE } from "../../../helpers/default";
import { MDBCard,MDBCardBody } from "mdb-react-ui-kit";

export const Photos = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  useEffect(() => {
    getAllPosts().then((response) => {
      console.log(response);
      setPosts(response.payload as IPost[]);
    });
  }, []);
  const photo = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState<string>("");
  const handlePostAdd = () => {
    const file = photo.current?.files?.[0];
    if (file) {
      const form = new FormData();
      form.append("photo", file);
      form.append("content", text);
      addPost(form).then((response) => {
        console.log(response);
        setPosts([...posts, response.payload as IPost]);
        setText("");
        photo.current = null;
      });
    }
  };

  const handleDelete =() => {
    handleDeletePhoto(posts).then((response) => {
      if (response) {
        const updatedPosts = posts.filter(post => post.id);
        setPosts(updatedPosts);}

    })
   
  }
  return (
    <>
 <MDBCard className="my-2 rounded-3" style={{ maxWidth: "2200px",backgroundColor:"rgb(227, 220, 230)"}}>
 <MDBCardBody className="px-5" >
      <h1>Photo</h1>
      <input type="file" ref={photo} />

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handlePostAdd}>Upload</button>

      {posts.map((elm) => (
        <div key={elm.id}>
          <br></br>
          <img
            src={BASE + elm.picture}
            style={{ maxHeight: "500px", maxWidth: "500px" }}
          />
          <br></br>
          <button
            className="btn btn-outline-danger my-5"
          >
            Delete
          </button>
        </div>
      ))}
      </MDBCardBody>
      </MDBCard>
    </>
  );
};
