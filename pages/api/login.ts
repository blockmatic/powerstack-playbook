import { NextApiRequest, NextApiResponse } from 'next'
import { auth_service } from '~/app-engine/services/jwt-auth-service'
import { AppUser } from '~/app-engine/types/app-engine'
import { withAppSession } from '~/session/index'

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { address, message, signature } = await req.body
  const { address } = await req.body
  console.log('/api/login', { address })

  try {
    const jwt_token = await auth_service.login()
    const user = { address: '0x123', jwt_token } as AppUser
    req.session.user = user
    await req.session.save()
    res.send({ user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withAppSession(loginRoute)