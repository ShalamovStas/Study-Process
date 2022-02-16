export default {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: {
          level: 1,
          align: null
        },
        content: [
          {
            type: "text",
            text: "Hello"
          }
        ]
      },
      {
        type: "paragraph",
        attrs: {
          align: null
        },
        content: [
          {
            type: "text",
            text: "This is editable text. "
          },
          {
            type: "text",
            marks: [
              {
                type: "text_color",
                attrs: {
                  color: "#d93f0b"
                }
              }
            ],
            text: "You can focus it and start typing"
          },
          {
            type: "text",
            text: "."
          }
        ]
      }
    ]
  };
  