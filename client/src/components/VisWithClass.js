import { TweenMax, TimelineMax, Expo } from "gsap/TweenMax"
import React, { Component } from 'react'
import * as THREE from 'three'
import '../index.css'

class VisWithClass extends Component {
  componentDidMount () {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    let board = {}

    const scene = new THREE.Scene()
    scene.updateMatrixWorld(true);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)

    // Cone Geometry
    let cones = []
    let coneMaterial = new THREE.MeshPhysicalMaterial({ color: 0xe8e8e8, emissive: 0x490000, flatShading: true })
    let coneGeometry = new THREE.ConeGeometry(2, 3, 14);
    coneGeometry.rotateX(Math.PI);

    for (let i = 0; i < 7; i++) {
      let mesh = new THREE.Mesh(coneGeometry, coneMaterial)
      mesh.position.set(-(7 * 3) + 7 * i, 13, 0)
      cones.push(mesh)
      scene.add(mesh)
    }

    // Coin geometry -> thorus + flipped cylinder
    let coinPlayerMaterial = new THREE.MeshPhysicalMaterial({ color: 0x3882a8, emissive: 0x233756, flatShading: true })
    let coinMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc93939, emissive: 0x542828, flatShading: true })
    let ringGeometry = new THREE.TorusGeometry(2.5, 0.35, 8, 64);
    let cylinderGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.45, 16);
    cylinderGeometry.rotateX(Math.PI / 2);
    let combinedGeometry = new THREE.Geometry();
    combinedGeometry.merge(ringGeometry);
    combinedGeometry.merge(cylinderGeometry);

    // Handle Click events
    const raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2()

    let light = new THREE.PointLight(0xFFFFFF, 1, 500)
    light.position.set(25, -10, 25)
    scene.add(light)

    // camera.position.z = 4
    camera.position.set(0, -5, 80)

    // scene.add(cube)
    renderer.setClearColor('#e5e5e5')
    renderer.setSize(width, height)

    this.socket = this.props.socket
    this.board = board
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.raycaster = raycaster
    this.mouse = mouse
    this.cube = cube
    this.cones = cones;
    this.coinPlayerMaterial = coinPlayerMaterial
    this.coinMaterial = coinMaterial
    this.combinedGeometry = combinedGeometry
    this.turn = this.props.turn

    window.addEventListener('resize', () => {
      const width = this.mount.clientWidth
      const height = this.mount.clientHeight
      this.renderer.setSize(width, height)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    })
    window.addEventListener('click', this.onMouseMove)

    // RECEIVE :: Room number
    this.socket.on('move', res => {
      this.turn = true
      this.addCoin(res, false)
    })

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount () {
    window.removeEventListener('resize')
    window.removeEventListener('click')
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  addCoin = (x, boolean) => {
    let mesh = new THREE.Mesh(this.combinedGeometry, boolean ? this.coinPlayerMaterial : this.coinMaterial)
    mesh.position.x = x
    mesh.position.y = 15

    if (!this.board[x / 7]) {
      this.board[x / 7] = 1
    } else {
      this.board[x / 7]++
    }

    this.scene.add(mesh)

    // Fall animation
    this.tl = new TimelineMax()
    // this.tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut })
    // this.tl.to(intersects[i].object.scale, .5, { x: .5, ease: Expo.easeOut })
    this.tl.to(mesh.position, 1, { y: -32 + 6.5 * this.board[x / 7], ease: Expo.easeOut })
    this.tl.to(mesh.rotation, 1.5, { y: Math.PI, ease: Expo.easeOut }, "=-.6")
    this.tl.to(mesh.material, .5, { opacity: 0 })
  }

  onMouseMove = (event) => {
    console.log(this.turn)
    if (!this.turn) return
    event.preventDefault()
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1



    // Check if player clicked on the cones
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(/*scene.children*/ this.cones, true)

    for (let i = 0; i < intersects.length; i++) {
      let position = new THREE.Vector3();
      position.setFromMatrixPosition(intersects[i].object.matrixWorld);
      // alert(position.x + ',' + position.y + ',' + position.z);

      this.addCoin(position.x, true)
      console.log('addcoin')
      // EMIT :: List of Rooms
      this.socket.emit('move', this.props.game, position.x)
      this.turn = false
    }
  }

  animate = () => {
    // this.cone.rotation.x += 0.01
    for (let cone of this.cones) {
      cone.rotation.y += 0.01
    }


    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render () {
    return (
      <div
        className="vis"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

export default VisWithClass