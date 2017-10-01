import "./NotePane.less"

import React, { Component } from "react"
import { Editor, EditorState } from "draft-js"
import autobind from "autobind-decorator"

@autobind
export default class NotePane extends Component {

  state = {
    editorState: EditorState.createEmpty()
  }

  render() {
    return (
      <section className="NotePane">
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
        {/* <p>Words and other things that sound like words</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egone non intellego, quid sit don Graece, Latine voluptas? Universa enim illorum ratione cum tota vestra confligendum puto. Nihil opus est exemplis hoc facere longius. Verum hoc loco sumo verbis his eandem certe vim voluptatis Epicurum nosse quam ceteros. Fortitudinis quaedam praecepta sunt ac paene leges, quae effeminari virum vetant in dolore. Duo Reges: constructio interrete.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae similitudo in genere etiam humano apparet. Prioris generis est docilitas, memoria; Eodem modo is enim tibi nemo dabit, quod, expetendum sit, id esse laudabile. Non quam nostram quidem, inquit Pomponius iocans; Aliter enim explicari, quod quaeritur, non potest. Tollitur beneficium, tollitur gratia, quae sunt vincla concordiae.</p> */}
      </section>
    )
  }

  onChange(editorState) {
    this.setState({
      editorState
    })
  }

}