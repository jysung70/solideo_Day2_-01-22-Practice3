import { MapLocation, MarkerData, Route } from '@types/map'

// 마커 아이콘 색상
const MARKER_COLORS = {
  origin: '#EF4444', // 빨간색
  destination: '#3B82F6', // 파란색
  recommendation: '#F59E0B', // 노란색
}

export class GoogleMapsService {
  private map: google.maps.Map | null = null
  private markers: google.maps.Marker[] = []
  private polylines: google.maps.Polyline[] = []
  private infoWindow: google.maps.InfoWindow | null = null

  /**
   * 지도 초기화
   */
  initMap(container: HTMLElement, center: MapLocation, zoom: number = 12): google.maps.Map {
    this.map = new google.maps.Map(container, {
      center: { lat: center.lat, lng: center.lng },
      zoom,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      fullscreenControl: true,
      streetViewControl: false,
    })

    this.infoWindow = new google.maps.InfoWindow()

    return this.map
  }

  /**
   * 모든 마커 제거
   */
  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null))
    this.markers = []
  }

  /**
   * 마커 추가
   */
  addMarker(
    data: MarkerData,
    onClick?: (marker: MarkerData) => void
  ): google.maps.Marker | null {
    if (!this.map) return null

    const marker = new google.maps.Marker({
      position: { lat: data.position.lat, lng: data.position.lng },
      map: this.map,
      title: data.title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: MARKER_COLORS[data.type],
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10,
      },
    })

    // 클릭 이벤트
    marker.addListener('click', () => {
      if (onClick) {
        onClick(data)
      }
      this.showInfoWindow(marker, data)
    })

    this.markers.push(marker)
    return marker
  }

  /**
   * InfoWindow 표시
   */
  private showInfoWindow(marker: google.maps.Marker, data: MarkerData): void {
    if (!this.infoWindow) return

    const content = `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${data.title}</h3>
        ${data.description ? `<p style="margin: 4px 0; font-size: 14px; color: #666;">${data.description}</p>` : ''}
        ${data.arrivalTime ? `<p style="margin: 4px 0; font-size: 14px; color: #3B82F6;">도착 예정: ${data.arrivalTime}</p>` : ''}
      </div>
    `

    this.infoWindow.setContent(content)
    this.infoWindow.open(this.map, marker)
  }

  /**
   * 모든 경로 제거
   */
  clearRoutes(): void {
    this.polylines.forEach((polyline) => polyline.setMap(null))
    this.polylines = []
  }

  /**
   * 경로 그리기
   */
  drawRoute(route: Route, isSelected: boolean = false): void {
    if (!this.map) return

    const path: google.maps.LatLng[] = []

    // 각 step의 시작과 끝 지점을 path에 추가 (중복 제거)
    route.steps.forEach((step, index) => {
      const fromLatLng = new google.maps.LatLng(step.from.lat, step.from.lng)
      const toLatLng = new google.maps.LatLng(step.to.lat, step.to.lng)

      // 첫 번째 step의 from은 항상 추가
      if (index === 0) {
        path.push(fromLatLng)
      }

      // to는 항상 추가 (다음 step의 from과 중복되더라도)
      path.push(toLatLng)
    })

    console.log(`🗺️ [GoogleMaps] Drawing route ${route.id}:`, {
      name: route.name,
      steps: route.steps.length,
      pathPoints: path.length,
      color: route.color,
      isSelected
    })

    if (path.length < 2) {
      console.warn(`⚠️ [GoogleMaps] Route ${route.id} has insufficient path points:`, path.length)
      return
    }

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: route.color,
      strokeOpacity: isSelected ? 1.0 : 0.6,
      strokeWeight: isSelected ? 6 : 4,
      map: this.map,
    })

    this.polylines.push(polyline)
  }

  /**
   * 특정 경로 강조
   */
  highlightRoute(routeId: string, routes: Route[]): void {
    this.clearRoutes()
    routes.forEach((route) => {
      this.drawRoute(route, route.id === routeId)
    })
  }

  /**
   * 지도 범위를 마커들에 맞게 조정
   */
  fitBounds(locations: MapLocation[]): void {
    if (!this.map || locations.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    locations.forEach((location) => {
      bounds.extend({ lat: location.lat, lng: location.lng })
    })

    this.map.fitBounds(bounds)
  }

  /**
   * 지도 중심 이동
   */
  panTo(location: MapLocation): void {
    if (!this.map) return
    this.map.panTo({ lat: location.lat, lng: location.lng })
  }

  /**
   * 줌 레벨 설정
   */
  setZoom(zoom: number): void {
    if (!this.map) return
    this.map.setZoom(zoom)
  }

  /**
   * 지도 객체 반환
   */
  getMap(): google.maps.Map | null {
    return this.map
  }
}
