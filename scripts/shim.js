const fs = require('fs');

// Remove @types/react@18
{
  const paths = [
    './node_modules/@types/react-native-vector-icons/node_modules/@types/react',
    './node_modules/@types/hoist-non-react-statics/node_modules/@types/react',
    './node_modules/@types/styled-components/node_modules/@types/react',
    './node_modules/@types/styled-components-react-native/node_modules/@types/react',
  ];
  paths.forEach((path) => {
    fs.rmSync(path, { recursive: true, force: true });
  });
}
