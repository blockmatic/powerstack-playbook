import { styled } from '../app-view/styles/stitches.config'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { Container, Footer, Header } from '~/app-view/components/layout'
import { Button, Input } from '~/app-view/components/base'
import { useAppEngine } from '~/app-engine'
import { useState } from 'react'
import { withSessionSsr } from '~/app-server/session'
import { AppGraphQL, createApolloClient } from '~/app-engine/graphql'
import { Accounts } from '~/app-engine/graphql/generated-sdk'

const MainContent = styled('div', {
  minHeight: '75vh',
  position: 'relative',
})

const LoginBackground = styled('div', {
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100%',
  minHeight: '100vh',
})

const ButtonGroup = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: 450,
  paddingTop: '$small',
})

const ssrHandler = async ({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<AccountSSRProps>> => {
  const user = req.session.user
  if (!user)
    return {
      props: {
        user: null,
      },
    }
  const apollo_client = createApolloClient(user.jwt)

  const result = await apollo_client.query<
    AppGraphQL.AccountsQuery,
    AppGraphQL.AccountsQueryVariables
  >({
    query: AppGraphQL.AccountsDocument,
    variables: {
      where: {
        username: { _eq: 'gaboesquivel' },
      },
    },
  })

  console.log('result', result)

  return {
    props: {
      user: result.data.accounts[0],
    },
  }
}

interface AccountSSRProps {
  user: Accounts | null
}

export const getServerSideProps: GetServerSideProps = withSessionSsr<AccountSSRProps>(ssrHandler)

const Home: NextPage<AccountSSRProps> = ({ user }) => {
  const { createUserAccount } = useAppEngine()
  const [username, setUsername] = useState('')
  return (
    <LoginBackground>
      <Header />
      <MainContent>
        <Container>
          <pre>{JSON.stringify({ user })}</pre>
          <Input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            alt="Type your username"
            css={{ maxWidth: 450, width: '100%' }}
          />
          <ButtonGroup>
            <Button onClick={() => createUserAccount(username)}>Create your Account</Button>
          </ButtonGroup>
        </Container>
      </MainContent>
      <Footer />
    </LoginBackground>
  )
}

export default Home
