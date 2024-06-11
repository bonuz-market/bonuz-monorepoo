import { gql } from '@apollo/client';

// Query to get user profiles by wallets
export const GET_USER_PROFILES_BY_WALLETS = gql`
  query GetUserProfilesByWallets($wallets: [ID!]!) {
    userProfiles(where: { id_in: $wallets }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
      }
    }
  }
`;

// Use the above query in a component
// const { loading, error, data } = useQuery(GET_USER_PROFILES_BY_WALLETS, {
//   variables: {
//     wallets: ["0x1d0344f3122847ed3852c7c54c155f9d22f2b6d6", "0x41503386c8f1e2ee26d7293b4a7ee7f4be9f7976", "0x79140dbeb75c36210ae928201ee267051c4b4213"]
//   },
// });

// Query to get user profile by wallet
export const GET_USER_PROFILE_BY_WALLET = gql`
  query GetUserProfileByWallet($wallet: ID!) {
    userProfile(where: { id: $wallet }) {
      wallet: id
      handle
      name
      wallet
      profileImage
      socialLinks {
        platform
        link
      }
    }
  }
`;

// Use the above query in a component
// const { loading, error, data } = useQuery(GET_USER_PROFILE_BY_WALLET, {
//   variables: {
//     wallet: "0x1d0344f3122847ed3852c7c54c155f9d22f2b6d6"
//   },
// });

// Query to get user profiles by handles
export const GET_USER_PROFILES_BY_HANDLES = gql`
  query GetUserProfilesByHandles($handles: [String!]!) {
    userProfiles(where: { handle_in: $handles }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
        lastUpdated
      }
    }
  }
`;

// Use the above query in a component
// const { loading, error, data } = useQuery(GET_USER_PROFILES_BY_HANDLES, {
//   variables: {
//     handles: ["mende", "jc", "mostafa"]
//   },
// });

// Query to get user profile by handle
export const GET_USER_PROFILE_BY_HANDLE = gql`
  query GetUserProfileByHandle($handle: String!) {
    userProfiles(where: { handle: $handle }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
        lastUpdated
      }
    }
  }
`;

// Use the above query in a component
// const { loading, error, data } = useQuery(GET_USER_PROFILE_BY_HANDLE, {
//   variables: {
//     handle: "mende"
//   },
// });

// Query to get user profiles by handle using regex
export const GET_USER_PROFILES_BY_HANDLE_REGEX = gql`
  query GetUserProfilesByHandleRegex($handle: String!) {
    userProfiles(where: { handle_contains: $handle }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
        lastUpdated
      }
    }
  }
`;

// Use the above query in a component
// const { loading, error, data } = useQuery(GET_USER_PROFILES_BY_HANDLE_REGEX, {
//   variables: {
//     handle: "men"
//   },
// });
