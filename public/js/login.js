
var ckb = document.getElementById('ckbExibir')
var checked = ckb.checked
var pass = document.querySelector('.pass')
var attribute = pass.getAttribute('type')


ckb.addEventListener('click', () => {
  if (checked) {
    pass.setAttribute('type', 'password')
  } else {
    pass.setAttribute('type', 'text')
  }
  checked = ckb.checked
})