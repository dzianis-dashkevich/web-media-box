export const testString = `<?xml version="1.0" encoding="UTF-8"?><MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" maxSubsegmentDuration="PT5.0S" mediaPresentationDuration="PT9M57S" minBufferTime="PT5.0S" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011,http://xmlns.sony.net/metadata/mpeg/dash/profile/senvu/2012" type="static" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd">
  <Period duration="PT9M57S" id="P1">
  <!-- Adaptation Set for main audio -->
  <AdaptationSet audioSamplingRate="48000" codecs="mp4a.40.5" contentType="audio" group="2" id="2" lang="en" mimeType="audio/mp4" subsegmentAlignment="true" subsegmentStartsWithSAP="1">
    <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="2"/>
    <Role schemeIdUri="urn:mpeg:dash:role:2011" value="main"/>
    <Representation bandwidth="64000" id="2_1">
      <BaseURL>DASH_vodaudio_Track5.m4a</BaseURL>
    </Representation>
  </AdaptationSet>
  <!-- Adaptation Set for video -->
  <AdaptationSet codecs="avc1.4D401E" contentType="video" frameRate="24000/1001" group="1" id="1" maxBandwidth="1609728" maxHeight="480" maxWidth="854" maximumSAPPeriod="5.0" mimeType="video/mp4" minBandwidth="452608" minHeight="480" minWidth="854" par="16:9" sar="1:1" subsegmentAlignment="true" subsegmentStartsWithSAP="1">
    <Role schemeIdUri="urn:mpeg:dash:role:2011" value="main"/>
    <Representation bandwidth="1005568" height="480" id="1_1" mediaStreamStructureId="1" width="854">
      <BaseURL>DASH_vodvideo_Track2.m4v</BaseURL>
    </Representation>
    <Representation bandwidth="1609728" height="480" id="1_2" mediaStreamStructureId="1" width="854">
      <BaseURL>DASH_vodvideo_Track1.m4v</BaseURL>
    </Representation>
    <Representation bandwidth="704512" height="480" id="1_3" mediaStreamStructureId="1" width="854">
      <BaseURL>DASH_vodvideo_Track3.m4v</BaseURL>
    </Representation>
    <Representation bandwidth="452608" height="480" id="1_4" mediaStreamStructureId="1" width="854">
      <BaseURL>DASH_vodvideo_Track4.m4v</BaseURL>
    </Representation>
  </AdaptationSet>
  </Period>
  </MPD>`;
