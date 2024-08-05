import { gql } from '@apollo/client';

export const GET_APP_BY_ID_QUERY = gql`
  query MyQuery($id: Int!) {
    App(id: $id) {
      id
      name
      slug
      description
      logo {
        url
      }
      image {
        url
      }
      link
      type
      category
      check_ins {
        id
        user {
          id
          walletAddress
          smartAccountAddress
          handle
          createdAt
        }
      }
    }
  }
`;
// ---

export const GET_APPS_QUERY = gql`
  query {
    Apps {
      docs {
        id
        name
        slug
        description
        logo {
          id
          url
        }
        image {
          id
          url
        }
        link
        type
        category
      }
    }
  }
`;
// ---------------------------------------------------------------------------------------------

export const CREATE_APP_MUTATION = gql`
  mutation CreateApp(
    $name: String!
    $slug: String!
    $description: JSON!
    $image: String!
    $logo: String!
    $link: String!
    $type: App_type_MutationInput!
    $category: App_category_MutationInput!
  ) {
    createApp(
      data: {
        name: $name
        slug: $slug
        description: $description
        image: $image
        logo: $logo
        link: $link
        type: $type
        category: $category
      }
    ) {
      id
      slug
      name
      description
      image {
        url
      }
      logo {
        url
      }
      link
      type
      category
    }
  }
`;

// 
// 

export const CREATE_APP_NEW_MUTATION = gql`
  mutation CreateApp(
    $name: String!
    $image: String!
    $banner: String!
    $link: String!
    $tokenGating: App_tokenGating_MutationInput!
    $contractAddress: String!
    $tokenGatingAmount: Float!
    $network: App_network_MutationInput!
  ) {
    createApp(
      data: {
        name: $name
        image: $image
        banner: $banner
        link: $link
        tokenGating: $tokenGating
        contractAddress: $contractAddress
        tokenGatingAmount: $tokenGatingAmount
        network: $network
      }
    ) {
      id
      name
      image {
        url
      }
      banner {
        url
      }
      link
      contractAddress
      network
    }
  }
`;

export const UPDATE_APP_NEW_MUTATION = gql`
  mutation UpdateApp(
    $id: Int!
    $name: String!
    $image: String!
    $banner: String!
    $link: String!
    $tokenGating: AppUpdate_tokenGating_MutationInput!
    $contractAddress: String!
    $tokenGatingAmount: Float!
    $network: AppUpdate_network_MutationInput!
  ) {
    updateApp(
      id: $id
      data: {
        name: $name
        image: $image
        banner: $banner
        link: $link
        tokenGating: $tokenGating
        contractAddress: $contractAddress
        tokenGatingAmount: $tokenGatingAmount
        network: $network
      }
    ) {
      id
      name
      image {
        url
      }
      banner {
        url
      }
      link
      contractAddress
      network
    }
  }
`;


export const GET_APPS_NEW_QUERY = gql`
  query {
    Apps {
      docs {
        id
        name
        image {
          id
          url
        }
        link
        type
        status
        check_ins {
          id
          user {
            id
            walletAddress
            smartAccountAddress
            handle
            createdAt
          }
        }
        tokenGating
        contractAddress
        tokenGatingAmount
        network
      }
    }
  }
`;

export const GET_APP_NEW_QUERY = gql`
  query MyQuery($id: Int!) {
    App(id: $id) {
      id
      name
      image {
        id
        url
      }
      banner {
        id
        url
      }
      link
      type
      check_ins {
        id
        user {
          id
          walletAddress
          smartAccountAddress
          handle
          createdAt
        }
      }
      tokenGating
      contractAddress
      tokenGatingAmount
      network
    }
  }
`;


// ---------------------------------------------------------------------------------------------

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent(
    $title: String!
    $partner: Int
    $shortDescription: String!
    $description: JSON!
    $agenda: JSON!
    $image: String!
    $banner: String!
    $link: String!
    $sourceEventLink: String!
    $start_date: String!
    $end_date: String!
    $challenges_new: [Int!]
    $location: String!
  ) {
    createEvent(
      data: {
        title: $title
        partner: $partner
        description: $description
        shortDescription: $shortDescription
        agenda: $agenda
        image: $image
        banner: $banner
        link: $link
        sourceEventLink: $sourceEventLink
        start_date: $start_date
        end_date: $end_date
        challenges_new: $challenges_new
        location: $location
      }
    ) {
      id
      title
      shortDescription
      description
      image {
        url
      }
      banner {
        url
      } 
      link
      sourceEventLink
      agenda
      start_date
      end_date
      challenges_new {
        id
        description
        image {
          id
          url
        }
      }
      location
    }
  }
`;



export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent(
    $id: Int!
    $title: String!
    $partner: Int
    $shortDescription: String!
    $description: JSON!
    $agenda: JSON!
    $image: String!
    $link: String!
    $start_date: String!
    $end_date: String!
    $challenges: [mutationEventUpdate_ChallengesInput]
    $location: String!
  ) {
    updateEvent(
      id: $id
      data: {
        title: $title
        partner: $partner
        description: $description
        shortDescription: $shortDescription
        agenda: $agenda
        image: $image
        link: $link
        start_date: $start_date
        end_date: $end_date
        challenges: $challenges
        location: $location
      }
    ) {
      id
      title
      shortDescription
      description
      image {
        url
      }
      link
      agenda
      start_date
      end_date
      challenges {
        id
        description
        image {
          id
          url
        }
      }
      location
    }
  }
`;


export const UPDATE_EVENT_WITH_NEW_CHALLENGES_MUTATION = gql`
  mutation UpdateEvent(
    $id: Int!
    $title: String!
    $partner: Int
    $shortDescription: String!
    $description: JSON!
    $agenda: JSON!
    $image: String!
    $banner: String!
    $link: String!
    $sourceEventLink: String!
    $start_date: String!
    $end_date: String!
    $challenges_new: [Int!]
    $location: String!
  ) {
    updateEvent(
      id: $id
      data: {
        title: $title
        partner: $partner
        description: $description
        shortDescription: $shortDescription
        agenda: $agenda
        image: $image
        banner: $banner
        link: $link
        sourceEventLink: $sourceEventLink
        start_date: $start_date
        end_date: $end_date
        challenges_new: $challenges_new
        location: $location
      }
    ) {
      id
      title
      shortDescription
      description
      image {
        url
      }
      banner {
        url
      }
      link
      sourceEventLink
      agenda
      start_date
      end_date
      challenges_new {
        id
        description
        image {
          id
          url
        }
      }
      location
    }
  }
`;


export const GET_PARTNER_BY_ID = gql`
  query MyQuery($id: Int!) {
    Partner(id: $id) {
      id
      slug
      title
      shortDescription
      description
      image {
        url
      }
      logo {
        url
      }
      link
      category
      agenda
      start_date
      end_date
      challenges {
        id
        description
        image {
          id
          url
        }
      }
      status
      location
      organizer
      check_ins {
        id
        user {
          id
          walletAddress
          smartAccountAddress
          handle
          createdAt
        }
      }
    }
  }
`;

export const GET_PARTNERS_EVENTS_QUERY = gql`
  query {
    Events {
      docs {
        id
        slug
        title
        shortDescription
        description
        image {
          id
          url
        }
        banner {
          id
          url
        }
        link
        category
        agenda
        start_date
        end_date
        challenges {
          id
          description
          image {
            url
          }
        }
        status
        location
        organizer
      }
    }
  }
`;


export const GET_EVENT_BY_ID = gql`
  query MyQuery($id: Int!) {
    Event (id: $id) {
      id
      title
      shortDescription
      description
      image {
        id
        url
      }
      link
      sourceEventLink
      agenda
      start_date
      end_date
      challenges_new {
        id
        name
        description
        image {
          id
          url
        }
        trackable   
        link     
      }
      location
      check_ins {
        id
        createdAt
        user {
          id
          walletAddress
          smartAccountAddress
          handle
          createdAt
        }
      }
    }
  }
`;

// -------------------------
export const ADD_NEW_PARTNER_MUTATION = gql`
  mutation CreatePartner(
    $name: String!
    $description: JSON!
    $image: String!
    $link: String!
    $logo: String!
    $externalNftCollection: String!
  ) {
    createPartner(
      data: {
        name: $name
        description: $description
        image: $image
        link: $link
        logo: $logo
        externalNftCollection: $externalNftCollection
      }
    ) {
      id
      name
      description
      image {
        url
      }
      logo {
        url
      }
      link
      externalNftCollection
      status
    }
  }
`;

export const UPDATE_PARTNER_MUTATION = gql`
  mutation UpdatePartner(
    $id: Int!
    $name: String!
    $description: JSON!
    $image: String!
    $logo: String!
    $link: String!
    $externalNftCollection: String!
  ) {
    updatePartner(
      id: $id
      data: {
        name: $name
        description: $description
        image: $image
        logo: $logo
        link: $link
        externalNftCollection: $externalNftCollection
      }
    ) {
      id
      name
      description
      image {
        id
        url
      }
      logo {
        id
        url
      }
      link
      externalNftCollection
      status
    }
  }
`;

export const GET_NEW_PARTNERS_QUERY = gql`
  query {
    Partners {
      docs {
        id
        name
        owner{
          walletAddress
          smartAccountAddress
          handle
        }
        description
        image {
          id
          url
        }
        logo {
          id
          url
        }
        link
        externalNftCollection
        status
      }
    }
  }
`;

export const GET_NEW_PARTNER_QUERY_BY_ID = gql`
  query MyQuery($id: Int!) {
    Partner(id: $id) {
      id
      name
      description
      image {
        id
        url
      }
      logo {
        id
        url
      }
      link
      externalNftCollection
      status
    }
  }
`;


// ------------------------
export const GET_DEFAULT_CHALLENGES_QUERY = gql`
  query {
    DefaultChallenges {
      docs {
        id
        name
        description
        image {
          id
          url
        }
      }
    }
  }
`;

export const GET_PARTNERS_EVENTS_CHALLENGES_QUERY = gql`
  query {
    Challenges {
      docs {
        id
        name
        description
        image {
          id
          url
        }
        link
      }
    }
  }
`;


export const CREATE_PARTNERS_EVENTS_CHALLENGES_MUTATION = gql`
  mutation CreateChallenge(
    $name: String!
    $description: String!
    $image: String!
    $trackable: Float!
    $link: String!
    $label: String!
  ) {
    createChallenge(
      data: {
        name: $name
        description: $description
        image: $image
        trackable: $trackable
        link: $link
        label: $label
      }
    ) {
      id
      name
      description
      image {
        url
      }
      trackable
      link
      label
    }
  }
`;

export const UPDATE_PARTNERS_EVENTS_CHALLENGES_MUTATION = gql`
  mutation UpdateChallenge(
    $id: Int!
    $name: String!
    $description: String!
    $image: String!
    $trackable: Float!
    $link: String!
    $label: String!
  ) {
    updateChallenge(
      id: $id
      data: {
        name: $name
        description: $description
        image: $image
        trackable: $trackable
        link: $link
        label: $label
      }
    ) {
      id
      name
      description
      image {
        url
      }
      trackable
      link
      label
    }
  }
`;
// -------------------------------------------
export const GET_NFTS_QUERY = gql`
    query {
      Nfts {
        docs {
          id
          minterWalletAddress
          userWalletAddress
          txHash
          user {
            handle
            walletAddress
            smartAccountAddress
          }
          partner {
            id
          }
          tokenId
          tokenType
          createdAt
        }
      }
    }
`;
// -------------------------

export const GET_PARTNER_MINTED_VOUCHERS = gql`
    query GetFilteredNfts($minterWalletAddress: String!, $tokenType: String!) {
      Nfts(minterWalletAddress: $minterWalletAddress, tokenType: $tokenType) {
        docs {
          id
          minterWalletAddress
          userWalletAddress
          txHash
          partner {
            id
          }
          tokenId
          tokenType
        }
      }
    }
`;
