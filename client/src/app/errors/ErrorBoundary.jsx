import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // כרגע רק console. בהמשך נוסיף telemetry.
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h1>Something went wrong</h1>
          <p>Try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
