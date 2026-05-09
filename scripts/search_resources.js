const resources = ['Docs', 'Guidelines'];
function search(query) {
  return resources.filter(r => r.toLowerCase().includes(query.toLowerCase()));
}
console.log(search('doc'));