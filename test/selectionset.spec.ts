import { afterAll, beforeAll, expect, test } from 'vitest'
import { signIn, signOut } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
import outputs from '..//amplify_outputs.json'
import { Amplify } from 'aws-amplify'
import { username, password } from '../amplify/seed/testuser'

Amplify.configure(outputs)

beforeAll(async () => {
  await signIn({
    username: username,
    password: password
  })
})
afterAll(async () => {
  await signOut()
})

const client = generateClient<Schema>({ authMode: 'userPool' })

test('When a selectionSet is specified, both the create and get operations must return the same data', async () => {
  const groupId = "admin"
  const createBlog = await client.models.Blog.create({
    name: 'blog name',
    groupId
  })

  if (!createBlog.data) {
    console.log(createBlog)
    throw new Error('No data returned from createBlog')
  }
  const selectionSet = ['id', 'title', 'content', 'blog.*'] as const
  const createPost = await client.models.Post.create(
    {
      title: 'title',
      content: 'content',
      blogId: createBlog.data.id,
      groupId
    },
    {
      selectionSet
    }
  )

  if (!createPost.data) {
    throw new Error('No data returned from createPost')
  }

  const { data: getTestB } = await client.models.Post.get(
    { id: createPost.data.id },
    {
      selectionSet
    }
  )
  expect(createPost.data).toEqual(getTestB)
})
