import styled from "styled-components"

import Navigation from "../../layout/Navigation"

const Main = styled.main`
  margin: 80px 0;
`

function EditorIndex(props) {
  return (
    <Main>
      <Navigation
        storeUser={props.storeUser}
      />
      <div>
        editorindex
    </div>
    </Main>
  )
}

export default EditorIndex