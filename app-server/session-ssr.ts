import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { AppState, app_engine } from '~/app-engine'
import { withSessionSsr } from './session-hoc'
export interface DefaultSessionSsrProps {
  app_engine_server_state: AppState
}

export const defaultGetServerSideProps: GetServerSideProps = withSessionSsr<DefaultSessionSsrProps>(
  async ({
    req,
  }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<DefaultSessionSsrProps>> => {
    // this all runs in parallel even if you use await
    await app_engine.getState().setUser(req.session.user || null)
    await app_engine.getState().fetchPrices()
    console.log('user', await app_engine.getState().user)
    await app_engine.getState().fetchUserBalances()

    return {
      props: {
        app_engine_server_state: JSON.parse(JSON.stringify(app_engine.getState())),
      },
    }
  },
)

export type DefaultSsrPage = NextPage<DefaultSessionSsrProps>
