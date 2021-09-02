import { useEffect, useRef } from "react";
import "./preview-wrapper.css";
interface PreviewProps {
  code: string;
  bundlingError: string;
}

const html = `
    <html>
      <head>
        <style> html {
          background-color: white;
        } </style>
      </head>
      <body>
        <div id="root"> </div>
        <script>
          const handleError = (error)=> {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color:red;" id="error-message"> <h4>Runtime Error </h4>' + error + '</div>';
            console.log(error)
            throw error;
          }
          //catch async errors - exp with setTimeout in code editor
          window.addEventListener('error', (event)=>{
            event.preventDefault();
            const err = handleError(event.error);
          });

          window.addEventListener('message', (event)=>{
            try {
              eval(event.data);
            } catch (error) {
              console.log(error)
              const err = handleError(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const refIframe = useRef<any>();

  useEffect(() => {
    // console.log(refIframe.current);
    //reset iframe
    refIframe.current.srcdoc = html;
    // otherwise chance it could run before prev  update
    setTimeout(() => {
      refIframe.current.contentWindow.postMessage(
        code,
        // allow commincation from outter sources
        "*"
      );
    }, 50);
    //
    return () => {
      // onmount or next invocation of useEffect
    };
  }, [code]);
  console.log(`bundlingError`, bundlingError);
  return (
    <div className={"preview-wrapper"}>
      <iframe
        ref={refIframe}
        title="code-preview"
        srcDoc={html}
        // allows = "allow-same-origin" || "" | false - sandboxes from other JS scopes
        sandbox="allow-scripts"
        style={{
          backgroundColor: "snow",
        }}
        // src="test.html"
        // frameBorder="0"
      />
      {bundlingError && (
        <div className="preview-error">
          <h2> Transpilation Error: </h2>
          {bundlingError}
        </div>
      )}
    </div>
  );
};

export default Preview;
