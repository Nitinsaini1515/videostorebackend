import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware"
import { AddVideoIntoPlaylist, DeletePlaylist, GetPlaylistById, GetUserPlaylist, PlaylistCreate, RemoveVideoFromPlaylist, UpdatePlaylist } from "../controller/playlist.controller";
const router = Router()

router.route("/playlist-create").post(verifyJWT,PlaylistCreate)
router.route("get-user-playlist").get(verifyJWT,GetUserPlaylist)
router.route("get-playlist-byid\:userId").get(verifyJWT,GetPlaylistById)
router.route("playlistid/:PlaylistId/video/:VideoId").post(verifyJWT,AddVideoIntoPlaylist)
router.route("playlistid/:PlaylistId/video/:VideoId").post(verifyJWT,RemoveVideoFromPlaylist)
router.route("update-playlist/:playlistId").post(verifyJWT,UpdatePlaylist)
router.route("delete-playlist/:playlistId").post(verifyJWT,DeletePlaylist)

