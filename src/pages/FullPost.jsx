import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import { Post } from '../components/Post'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import axios from '../axios'

export const FullPost = () => {
  const [data, setData] = React.useState()
  const [isLoading, setLoading] = React.useState(true)
  const { id } = useParams()

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.warn(err)
        alert('Ошибка при получении статьи')
      })
  }, [])

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? process.env.REACT_APP_API_URL + data.imageUrl : ''}
        user={{
          ...data.user,
          avatarUrl: data.user.avatarUrl
            ? process.env.REACT_APP_API_URL + data.user.avatarUrl
            : 'https://static.tildacdn.com/tild3266-3839-4665-a533-623166323531/no-profile.png',
        }}
        createdAt={new Date(data.createdAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
        })}
        viewsCount={data.viewsCount}
        commentsCount={0}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      {/* <CommentsBlock
        items={[]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock> */}
    </>
  )
}
