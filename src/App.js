import React, { Component } from "react";
import styles from "./App.module.scss";
import fetchJsonp from "fetch-jsonp";

const {accessToken} = require('token.json');
const parsingSelfUrl = `https://api.instagram.com/v1/users/self/?access_token=${accessToken}`;
const parsingRecentUrl = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${accessToken}`;

class App extends Component {
  state = {
    selfData: null,
    postData: null,
    loading: true
  };
  render() {
    return (
      <div className={styles.appRoot}>
        {this.state.loading && <div>로딩 중..</div>}
        {!this.state.loading && <Content data={this.state} />}
      </div>
    );
  }

  componentDidMount() {
    ParseSelfInfo()
    .then(selfData=>{
      // console.log(selfData)
      this.setState({
        ...this.state,
        selfData
      })
    })

    ParseRecentPost()
    .then(postData=>{
      // console.log(postData)
      this.setState({
        ...this.state,
        postData
      })
      console.log(this.state)
    })
  }

  componentDidUpdate() {
    const { selfData, postData } = this.state;
    if ( selfData && postData && this.state.loading) {
      if(selfData.meta.code === 200 && postData.meta.code === 200 ) {
        this.setState({
          ...this.state,
          loading: false
        })
      }
    } else {
      console.log('not ready')
    }
  }
}

const Content = ({ data : { selfData, postData }}) => {
  console.log(selfData, postData)
  const { data: {full_name, username, bio, profile_picture }} = selfData;
  return (
    <div className={styles.app}>
      <div className={styles.userInfo}>
        <div className={styles.column}>
          <img src={profile_picture} alt={bio} className={styles.profileImage} />
        </div>
        <div className={styles.column}>
          <p className={styles.name}><span>fullname</span><span>{full_name}</span></p>
          <p className={styles.name}><span>username</span><span>{username}</span></p>
          <p className={styles.bio}>{bio}</p>
        </div>
      </div>
      <div className={styles.items}>
        <div className={styles.item}>
          {postData.data.map(post=><Post {...post} key={post.id}/>)}
        </div>
      </div>
    </div>
  );
};

const Post = props => {
  const {images:{standard_resolution:{url}}, id, caption, link} = props;
  const handleClick = (link) => {
    window.open(link);
  }
  return (
    <div className={styles.content}>
      <img src={url} alt={id} className={styles.image} onClick={()=>handleClick(link)}/>
      {caption &&
        <div className={styles.box}>
          <span className={styles.text}>{caption.text}</span>
        </div>
      }
    </div>
  );
}

const ParseRecentPost = async () => {
  return await fetchJsonp(parsingRecentUrl)
    .then(response => response.json())
    .catch(err => console.error(err));
};

const ParseSelfInfo = async () => {
  return await fetchJsonp(parsingSelfUrl)
    .then(response => response.json())
    .catch(err => console.error(err));
};

export default App;
