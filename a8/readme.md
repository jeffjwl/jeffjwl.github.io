# A8 - Big Data Visualization 

## The Data and its Representation
For this assignment, I decided to visualize song trends and data from past years. The source data uses Spotify's methods of classifying songs which includes these attributes:

- beats per minute (bpm): the overall estimated tempo of a track in beats per minute (bpm). in musical terminology, tempo is the speed or pace of a given piece, and derives directly from the average beat duration.
- energy (nrgy): represents a perceptual measure of intensity and activity. typically, energetic tracks feel fast, loud, and noisy. for example, death metal has high energy, while a bach prelude scores low on the scale.
- danceability (dnce): describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.
-valence (val): describes the musical positiveness conveyed by a track. tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
- duration (dur): the duration of the track in seconds.
- acousticness (acous): a confidence measure of whether the track is acoustic.
- speechiness (spch): this detects the presence of spoken words in a track. the more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the higher the attribute value.

Using a radar chart for individual years and a line graph to show all the years, I wanted to show when certain musical trends may have formed or general musical trends that occur as time goes on. (Also, click on the header to change the theme)

## Note about the Data
The data pulls from the music from the Spotify playlist, "All out 19XXs/20XXs", so some years will have more songs to represent their data more than others. Due to this, the trends that you see in the chart will probably be a lot more inaccurate than I'd hoped for. Also I noticed that some songs that were remastered had their year attribute as the year they were remastered and not when they were originally made, so some of the more recent years' data may have data for a song in the 50-80s. 

## Attribution
- Big Data Visualization boilerplate code provided by Professor Kate Compton
- Spotify Past Decades Dataset (1950s-2010s): "https://www.kaggle.com/cnic92/spotify-past-decades-songs-50s10s"
- Spotify Attributes Reference: "https://towardsdatascience.com/what-makes-a-song-likeable-dbfdb7abe404"
- Styling Checkboxes: https://www.paulund.co.uk/how-to-style-a-checkbox-with-css */
- p5.js documentation: "https://p5js.org/reference/"
- Vue.js documentation: "https://vuejs.org/v2/guide/"