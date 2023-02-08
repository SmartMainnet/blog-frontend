import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab, Tabs, Grid } from '@mui/material'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.data)
  const { posts, tags } = useSelector(state => state.posts)

  const [value, setValue] = React.useState(0)

  const handleChange = (_, newValue) => {
    setValue(newValue)
  }

  const isPostLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'

  React.useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} onChange={handleChange} value={value}>
        <Tab label='Новые' value={0} />
        <Tab label='Популярные' value={1} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading
            ? [...Array(5)]
            : value
            ? [...posts.items].sort((a, b) => b.viewsCount - a.viewsCount)
            : posts.items
          ).map((post, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                _id={post._id}
                title={post.title}
                imageUrl={post.imageUrl ? process.env.REACT_APP_API_URL + post.imageUrl : ''}
                user={{
                  ...post.user,
                  avatarUrl: post.user.avatarUrl
                    ? process.env.REACT_APP_API_URL + post.user.avatarUrl
                    : 'https://static.tildacdn.com/tild3266-3839-4665-a533-623166323531/no-profile.png',
                }}
                createdAt={post.createdAt}
                viewsCount={post.viewsCount}
                commentsCount={3}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  )
}
