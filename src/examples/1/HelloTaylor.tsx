import React from "react"

type Props = {
    name: string
}

export class HelloMessage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
      return (
        <div>
          Hello {this.props.name}
        </div>
      );
    }
}

// <HelloMessage name="Taylor" />
