<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { positions, onSend } from '../../stores/driveControll';
    import L, { Map, Polyline } from 'leaflet';
    import { get } from 'svelte/store';
    import type { Script } from 'vm';
  
    let map: Map;
    let polyline: Polyline;
  
    onMount(() => {
      // Initialize the map
      map = L.map('map').setView([0, 0], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);
  
      // Initialize the polyline
      polyline = L.polyline([], { color: 'blue' }).addTo(map);


      const unsubscribe = positions.subscribe(posList => {
      const latlngs = posList.map(pos => [pos.latitude, pos.longitude] as [number, number]);
      polyline.setLatLngs(latlngs);
      if (latlngs.length > 0) {
        map.fitBounds(polyline.getBounds());
      }
    });

    onDestroy(() => {
      unsubscribe();
      map.remove();
    });
  });
 

</script>

<h2>ehfsef</h2>